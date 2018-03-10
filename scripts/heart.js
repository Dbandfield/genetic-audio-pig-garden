class Heart
{
    constructor(_heartGeo, _pig, _scn)
    {
        this.m_scn = _scn;

        this.m_heartGeo = _heartGeo.clone();
        this.m_heartMat = new THREE.MeshPhongMaterial({color:0xffdddd});
        this.m_heartMesh = new THREE.Mesh(this.m_heartGeo, this.m_heartMat);
        this.m_pig = _pig;

        this.m_obj = new THREE.Group();
        this.m_obj.add(this.m_heartMesh);
        this.m_scn.add(this.m_obj);

        this.m_height = 20;

        this.m_obj.position.copy(this.m_pig.getPosition());
        this.m_obj.position.y += this.m_height;

        this.m_flash = false;
    }

    update(_delta)
    {
        this.m_obj.position.x = this.m_pig.getPosition().x;
        this.m_obj.position.z = this.m_pig.getPosition().z;
        this.m_obj.position.y = this.m_pig.getPosition().y + this.m_height;

        if(this.m_flash)
        {
            var s = lerp(0.1, 1.0, Math.abs(Math.sin(performance.now()/1000)));
            this.m_obj.scale.set(s,s,s)
        }
    }

    removeFromScene()
    {
        this.m_scn.remove(this.m_obj);
    }

    flash()
    {
        this.m_flash = true;
    }
}
