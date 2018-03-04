class Pig
{
  constructor(_mdl, _listener, _scn, _floor, _params=null)
  {
      this.m_floor = _floor;
      this.m_scn = _scn;
      this.m_listener = _listener;

      //death
      this.m_dying = false;
      this.m_dead = false;
      // how long it takes for pig to die once dying has started
      this.m_dyingTmr = 0;
      this.m_dyingTmrMax = 10;
      this.m_deathAge = 10;

      this.m_ageStage = 1;
      this.m_ageSeconds = 0;
      this.m_tmToAge = (Math.random() * 30) + 60;
      this.m_ageFlashTmrMain = 0;
      this.m_ageFlashTmrSwitch= 0;
      this.m_ageFlashTmrMax = 1;
      this.m_ageFlashTmrMaxS = 1;
      this.m_ageFlash = false;
      this.m_ageFlashTrack = true;

      this.m_bcastLookForMate = false;
      this.m_lookForMate = false;
      this.m_reproduceTmr = 0;
      this.m_reproduceTmrMax = (Math.random() * 60) + 60;

      this.m_mate = null;
      this.m_sexStarted =false;
      this.m_sexEnded = false;
      this.m_sexTmr = 0;
      this.m_sexTmrMax = 6;

      // var ranGen = Math.random();
      // this.m_gender = ranGen < 0.5 ? "male" : "female";
      if(nextGender == "male")
      {
          this.m_gender = "male";
          nextGender = "female";
      }
      else
      {
          this.m_gender = "female";
          nextGender = "male";
      }

      this.m_height = 3;
      this.m_nrmCol = 0xffffff;
      this.m_sndCol = 0xff8888;
      this.m_ageCol = 0xffff00;
      this.m_reprCol = 0xffffff;
      this.m_fndMt= 0xffffff;

      // genetics
      if(_params)
      {
        this.m_params = _params;
      }
      else
      {
        this.m_params = new PigParams();
      }


      // model
    this.m_mdl = _mdl;
    this.m_mdl.material = new THREE.MeshLambertMaterial({color: this.m_nrmCol});
    this.m_mdl.material.skinning = true;
    this.m_mdl.rotateY(radians(270));

    // sound
    var conv = this.m_listener.context.createConvolver();
    this.m_player1 = new THREE.PositionalAudio(this.m_listener);
    this.m_player1.setDistanceModel('inverse');
    this.m_player1.setRefDistance(1);
    this.m_player1.setMaxDistance(50);
    this.m_player1.setRolloffFactor(5);
    var note = this.m_params.getNote(0);
    this.m_osc1 = this.m_listener.context.createOscillator();
    this.m_osc1.type = 'square';
    this.m_osc1.frequency.setValueAtTime(note,
                                        this.m_listener.context.currentTime);
    this.m_player1.setOscillatorSource(this.m_osc1, note);
    this.m_player1.setVolume(0.8);

    conv.buffer = this.m_osc1.buffer;

    this.m_player2 = new THREE.PositionalAudio(this.m_listener);
    this.m_player2.setDistanceModel('inverse');
    this.m_player2.setRefDistance(1);
    this.m_player2.setMaxDistance(50);
    this.m_player2.setRolloffFactor(10);
    this.m_osc2 = this.m_listener.context.createOscillator();
    this.m_osc2.type = 'sine';
    this.m_osc2.frequency.setValueAtTime(note,
                                        this.m_listener.context.currentTime);
    this.m_player2.setOscillatorSource(this.m_osc2, note);
    this.m_player2.setVolume(0.8);

    this.m_varTimeToSound = 10000;
    this.m_baseTimeToSound = 10000;
    this.m_timeToSound = 10000;

    //this.m_varSoundTime = 250;
    this.m_varSoundTime = 0;
    this.m_baseSoundTime = 500;
    this.m_soundTime = 500;

    var self = this;
    this.m_timeToSound = this.m_baseTimeToSound + Math.random(this.m_varTimeToSound);
    setTimeout(function(){self.playSound()}, self.m_timeToSound);

    this.m_obj = new THREE.Group();
    this.m_obj.add(this.m_mdl);
    this.m_obj.add(this.m_player1);
    this.m_obj.add(this.m_player2);

    _scn.add(this.m_obj);

    if(this.m_params.getPosition())
    {
        this.m_obj.position.copy(this.m_params.getPosition());
    }
    else
    {
        this.m_obj.position.set((Math.random() * 500) -250, this.m_height,
                                    (Math.random() * 500) -250);
    }

    // animations
    this.m_animMxr = new THREE.AnimationMixer(this.m_mdl);
    // this.m_clips = this.m_mdl.geometry.animations;

    //var clip = THREE.AnimationClip.findByName(this.m_clips, "ArmatureAction");
    var action = this.m_animMxr.clipAction("ArmatureAction");
    action.play();

    // MOVEMENT
    this.m_target = new THREE.Vector3((Math.random() * 500) -250, this.m_height,
        (Math.random() * 500) -250);
    this.m_movVel = new THREE.Vector3(1, 0, 0);
    this.m_movSpeed = 0.;
    this.m_maxMovSpeed = 0.3;
    this.m_movAccel = 0.001;
    this.m_rotSpeed = 0;
    this.m_maxRotSpeed = 0.08;
    this.m_rotAccel = 0.0001;
    this.m_distToChange = 50;

    this.m_gravVel = 0;
    this.m_raycaster = new THREE.Raycaster( new THREE.Vector3(),
        new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
  }

  getDead()
  {
      return this.m_dead;
  }

  update(delta)
  {
      this.m_animMxr.update(delta);
      if(!this.m_sexStarted) this.updateMovement(delta);
      if(!this.m_sexStarted) this.updateAge(delta);
      this.ageFlash(delta);
      this.reproduceUpdate(delta);
  }

  reproduceUpdate(_delta)
  {
      if(this.m_sexStarted && !this.m_sexEnded)
      {
          this.m_sexTmr += _delta;
          if(this.m_sexTmr > this.m_sexTmrMax)
          {
              this.m_sexStarted = false;
              this.m_sexEnded = true;
              this.m_sexTmr = 0;
          }
      }
      if(!this.m_lookForMate && this.m_ageStage > 1 && pigs.length < 30)
      {
          this.m_reproduceTmr += _delta;
          if(this.m_reproduceTmr > this.m_reproduceTmrMax)
          {
              console.log("Now looking for mate");
              this.m_lookForMate = true;
              this.m_reproduceTmr = 0;
              this.m_bcastLookForMate = true;
              this.m_mdl.material.setValues({color:this.m_reprCol});
          }
      }
  }

  getLookingForMate()
  {
      return this.m_bcastLookForMate;
  }

  getGender()
  {
      return this.m_gender;
  }

  getBaby()
  {
      if(this.m_lookForMate)
      {
          if(this.m_sexEnded)
          {
              this.m_sexStarted = false;
              this.m_sexEnded = false;
              this.m_lookForMate = false;
              this.m_bcastLookForMate = false;

              if(this.m_gender == "female")
              {
                  var p = PigParams.join(this.m_params, this.m_mate.getParams(), this.m_obj.position);
                  this.m_mate = null;
                  return p;
              }
              else
              {
                  this.m_mate = null;
                  return null;
              }
            }
      }
  }

  startSex()
  {
      if(!this.m_sexStarted)
      {
          this.m_sexStarted = true;
          this.m_sexEnded = false;
          this.m_sexTmr = 0;
          this.m_mate.startSex();
      }
      else
      {
      }
  }

  setMate(_mate)
  {
      console.log("Mate found!");
      this.m_mate = _mate;
      this.m_target = this.m_mate.getPosition();
      // this.m_target.y = this.m_height;
      this.m_bcastLookForMate = false;
      this.m_mdl.material.setValues({color:this.m_fndMt});
  }

  getPosition()
  {
      return this.m_obj.position;
  }

  ageFlash(_delta)
  {
      //console.log(this.m_ageFlashTmrMax);
      if(this.m_ageFlash)
      {
          this.m_ageFlashTmrMain += _delta;
          this.m_ageFlashTmrSwitch += _delta;
          if(this.m_ageFlashTmrSwitch > this.m_ageFlashTmrMax)
          {
              this.m_ageFlashTmrMaxS = Math.max(0.05, this.m_ageFlashTmrMaxS - 0.05);
              this.m_ageFlashTmrSwitch= 0;
              this.m_ageFlashTrack = !this.m_ageFlashTrack;
              if(this.m_ageFlashTrack)
              {
                  this.m_ageFlashTmrMax = 0.05
                  this.m_mdl.material.setValues({color:this.m_ageCol});
                  var scl = 1 + (this.m_ageStage/4);

                  this.m_mdl.scale.set(scl, scl, scl);
              }
              else
              {
                  this.m_ageFlashTmrMax = this.m_ageFlashTmrMaxS;
                  var scl = 1 + ((this.m_ageStage-1)/4);

                  this.m_mdl.scale.set(scl, scl, scl);
                  this.m_mdl.material.setValues({color:this.m_nrmCol});
              }
          }

          if(this.m_ageFlashTmrMain > 7)
          {
              this.m_ageFlashTmrMax= 1;
              this.m_ageFlashTmrMaxS=1;
              this.m_ageFlash = false;
              var scl = 1 + (this.m_ageStage/4);
              this.m_mdl.scale.set(scl, scl, scl);

              if(this.m_lookForMate)
              {
                  if(this.m_bcastLookForMate)
                  {
                  this.m_mdl.material.setValues({color:this.m_reprCol});
                }
                else
                {
                    this.m_mdl.material.setValues({color:this.m_fndMt});
                }
              }
              else
              {
                this.m_mdl.material.setValues({color:this.m_nrmCol});
            }
              this.m_ageFlashTmrMain = 0;
              this.m_ageFlashTmrSwitch = 0;
          }
      }
  }

  updateAge(_delta)
  {
      if(this.m_ageStage < this.m_deathAge)
      {
          this.m_ageSeconds += _delta;
          if(this.m_ageSeconds > this.m_tmToAge)
          {
              console.log("age!");
              this.m_ageStage ++;
              this.m_ageSeconds = 0;
              this.m_tmToAge = (Math.random() * 30) + 60;
              this.m_ageFlash = true;
          }
      }
      else
      {
          this.m_dying = true;

      }

      if(this.m_dying && !this.m_lookForMate)
      {
          this.m_dyingTmr += _delta;
          if(this.m_dyingTmr > this.m_dyingTmrMax)
          {
              this.m_scn.remove(this.m_obj);
              this.m_player1 = null;
              this.m_player2 = null;
              this.m_mate = null;
              this.m_dead = true;
          }
      }

      if(this.m_dead)
      {
          console.log(" I AM DEAD ");
      }
  }

    updateMovement(delta)
    {
        this.m_raycaster.ray.origin.copy(this.m_obj.position);
        this.m_raycaster.ray.origin.y -= 1;
        this.m_gravVel -= 10 * delta;
        var intersections = this.m_raycaster.intersectObject( this.m_floor );
        var onObject = intersections.length > 0;
        if ( onObject )
        {
            if(intersections[0].distance < 1)
            {
                this.m_gravVel = 0;
            }
        }
        else
        {
            this.m_gravVel = 1;
        }

        this.m_obj.translateY(this.m_gravVel);
        var toTarget = this.m_target.clone();

        toTarget.y = this.m_obj.position.y;

        var d = this.m_obj.position.distanceTo(toTarget);
        if(!(this.m_lookForMate && !this.m_bcastLookForMate))
        {
            if(d < this.m_distToChange)
            {
              this.m_target = this.randomTarget(this.m_obj.position,
                                            this.m_distToChange + 50,
                                            this.m_distToChange + 100);

            }
        }
        else
        {
            if(d < 10)
            {
                this.startSex();
            }
        }
        toTarget.sub(this.m_obj.position);
        var a = degrees(toTarget.angleTo(this.m_obj.getWorldDirection()));
        if (a < -5)
        {
          if(this.m_rotSpeed < this.m_maxRotSpeed) this.m_rotSpeed += this.m_rotAccel;
          this.m_obj.rotateY(-this.m_rotSpeed);
        }
        else if (a > 5)
        {
            if(this.m_rotSpeed < this.m_maxRotSpeed) this.m_rotSpeed += this.m_rotAccel;
            this.m_obj.rotateY(-this.m_rotSpeed);
        }
        else
        {
            if(this.m_rotSpeed > 0)
            {
                this.m_rotSpeed -= this.m_rotAccel;
            }

            if(this.m_movSpeed < this.m_maxMovSpeed)
            {
                this.m_movSpeed += this.m_movAccel;
            }

            this.m_obj.translateZ(this.m_movSpeed);
        }


    }

  randomTarget(_vec, _min, _max)
  {
      var v1 = _vec.clone();
      var v2 = new THREE.Vector3((Math.random() * (_max - _min))+ _min, this.m_height, 0);
      var a = radians(Math.random() * 360);
      v2.applyAxisAngle(new THREE.Vector3(0, 1, 0),
                        a);
      v1.add(v2);

      if(v1.distanceTo(new THREE.Vector3(0, this.m_height, 0)) > 700)
      {
          v1 = new THREE.Vector3(0, this.m_height, 0);
      }
      return v1;
  }

  playSound()
  {
      console.log("NOTES: " + this.m_params.getSong());

      var note = this.m_params.getNextNote();
      this.m_osc1.frequency.setValueAtTime(note,
                                          this.m_listener.context.currentTime);
      this.m_player1.setOscillatorSource(this.m_osc1, note);
      this.m_osc2.frequency.setValueAtTime(note,
                                          this.m_listener.context.currentTime);
      this.m_player2.setOscillatorSource(this.m_osc1, note);

      if(this.m_player1) this.m_player1.play();
      if(this.m_player2) this.m_player2.play();
      var self = this;
      this.m_soundTime = this.m_baseSoundTime + (Math.random()*this.m_varSoundTime);
      setTimeout(function(){if(self){self.nextSound();}}, self.m_soundTime);
      this.m_mdl.material.setValues({color:this.m_sndCol});
  }

  nextSound()
  {
      if(this.m_player1) this.m_player1.stop();
      if(this.m_player2)this.m_player2.stop();

      var note = this.m_params.getNextNote();

      var self = this;

      if(note)
      {
          this.m_osc1.frequency.setValueAtTime(note,
                                              this.m_listener.context.currentTime);
          this.m_player1.setOscillatorSource(this.m_osc1, note);
          this.m_osc2.frequency.setValueAtTime(note,
                                              this.m_listener.context.currentTime);
          this.m_player2.setOscillatorSource(this.m_osc1, note);
          if(this.m_player1) this.m_player1.play();
          if(this.m_player2) this.m_player2.play();
          setTimeout(function(){if(self){self.nextSound();}}, self.m_soundTime);
      }
      else
      {
          this.stopSound();
      }
  }

  stopSound()
  {
      var self = this;
      this.m_timeToSound = this.m_baseTimeToSound + (Math.random()*this.m_varSoundTime);
      setTimeout(function(){self.playSound()}, self.m_timeToSound);

      if(this.m_lookForMate)
      {
          if(this.m_bcastLookForMate)
          {
          this.m_mdl.material.setValues({color:this.m_reprCol});
        }
        else
        {
            this.m_mdl.material.setValues({color:this.m_fndMt});
        }
    }
      else
      {
          this.m_mdl.material.setValues({color:this.m_nrmCol});
      }

  }

  getParams()
  {
      return this.m_params;
  }

  getModel()
  {
      return this.m_mdl;
  }
}
