class Pig
{
  constructor(_mdl, _listener, _scn, _floor, _heartMdl, _params=null)
  {
      this.m_floor = _floor;
      this.m_scn = _scn;
      this.m_listener = _listener;
      this.m_heartMdl = _heartMdl;

      this.m_heart = null;

      this.m_playing = false;

      //death
      this.m_dying = false;
      this.m_dead = false;
      // how long it takes for pig to die once dying has started
      this.m_dyingTmr = 0;
      this.m_dyingTmrMax = 10;
      this.m_deathAge = 6;

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
      this.m_reproduceTmrMax = (Math.random() * 45) + 45;

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
      // this.m_nrmCol = 0xffffff;
      this.m_nrmCol = 0xffbbbb;
      this.m_sndCol = 0xff8888;
      this.m_ageCol = 0xffff00;
      this.m_reprCol = 0xffbbbb;
      this.m_fndMt= 0xffbbbb;


      // genetics
      if(_params)
      {
        this.m_params = _params;
      }
      else
      {
        this.m_params = new PigParams();
      }

      var logNotes = [];
      var song = this.m_params.getSong();
      var songString = "";
      for(var n in song)
      {
          if(song[n] == NOTES.A)
          {
              songString += " A";
          }
          else if(song[n] == NOTES.B)
          {
              songString += " B";
          }
          else if(song[n] == NOTES.C)
          {
              songString += " C";

          }
          else if(song[n] == NOTES.D)
          {
              songString += " D";

          }
          else if(song[n] == NOTES.E)
          {
              songString += " E";

          }
          else if(song[n] == NOTES.F)
          {
              songString += " F";

          }
          else if(song[n] == NOTES.G)
          {
              songString += " G";

          }
      }

      logger.log("A " + this.m_gender + " animal was born with the song" + songString);

      // model
    this.m_mdl = _mdl;
    this.m_mdl.material = new THREE.MeshLambertMaterial({color: this.m_nrmCol});
    this.m_mdl.material.skinning = true;
     this.m_mdl.rotateY(radians(180));
    this.m_mdl.rotateZ(radians(90));
    this.m_mdl.rotateX(radians(270));
    //this.m_mdl.rotateY(radians(270));

    // sound
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
    this.m_player1.setVolume(3.0);
    // this.m_filters1 = [];
    // this.m_filters1.push(new SimpleReverb(this.m_listener.context, {seconds: 0.1, decay: 2, reverse:1}));
    // this.m_filters1.push(new SimpleReverb(this.m_listener.context, {seconds: 0.2, decay: 2, reverse:1}));

    // console.log(this.m_filters1);
    // this.m_player1.setFilters(this.m_filters1);
    //
    // conv.buffer = this.m_osc1.buffer;

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
    this.m_player2.setVolume(3.0);
    // this.m_filters2 = [];
    // this.m_filters2.push(new SimpleReverb(this.m_listener.context, {seconds: 0.1, decay: 1, reverse:0}));
    // this.m_player2.setFilters(this.m_filters2);

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
        this.m_obj.position.set((Math.random() * (gardenSize/2)) -250, this.m_height,
                                    (Math.random() * (gardenSize/2)) -250);
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
      if(this.m_heart) this.m_heart.update();
      //else if(this.m_heartMdl) this.m_heart = new Heart(this.m_heartMdl, this, this.m_scn);
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
              // console.log("Now looking for mate");
              if(this.m_heartMdl)
              {
                  this.m_heart = new Heart(this.m_heartMdl, this, this.m_scn);
              }

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

              var p;

              if(this.m_gender == "female")
              {
                  p = PigParams.join(this.m_params, this.m_mate.getParams(), this.m_obj.position);
                  this.m_mate = null;
              }
              else
              {
                  this.m_mate = null;
                p = null;
            }
              if(this.m_heart)
              {
                  this.m_heart.removeFromScene();
                  this.m_heart = null;
              }

              return p;
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
      // console.log("Mate found!");
      this.m_mate = _mate;
      this.m_target = this.m_mate.getPosition();
      // this.m_target.y = this.m_height;
      this.m_bcastLookForMate = false;
      this.m_mdl.material.setValues({color:this.m_fndMt});
      this.m_heart.flash();
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

  kill()
  {
      this.m_ageStage = this.m_deathAge;
  }

  updateAge(_delta)
  {
      if(this.m_ageStage < this.m_deathAge)
      {
          this.m_ageSeconds += _delta;
          if(this.m_ageSeconds > this.m_tmToAge)
          {
              // console.log("age!");
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
          if(this.m_dyingTmr > this.m_dyingTmrMax && !this.m_playing)
          {
              this.m_scn.remove(this.m_obj);
              this.m_player1 = null;
              this.m_player2 = null;
              this.m_mate = null;
              this.m_dead = true;
              if(this.m_heart)
              {
                  this.m_heart.removeFromScene();
                  this.m_heart = null;
              }
          }
      }

      if(this.m_dead)
      {
          // console.log(" I AM DEAD ");
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

      if(v1.distanceTo(new THREE.Vector3(0, this.m_height, 0)) > (this.gardenSize/2))
      {
          v1 = new THREE.Vector3(0, this.m_height, 0);
      }
      return v1;
  }

  playSound()
  {
      // console.log("NOTES: " + this.m_params.getSong());

      this.m_playing = true;

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

      if(note && !this.m_dying)
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
      this.m_playing = false;
      var self = this;
      this.m_timeToSound = this.m_baseTimeToSound + (Math.random()*this.m_varSoundTime);

      if(!this.m_dying)
      {
          setTimeout(function(){self.playSound()}, self.m_timeToSound);
      }

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
