
class Pig
{
  constructor(_parent1, _parent2, _ctx)
  {
    this.m_ctx = _ctx;
    if(_parent1 && _parent2)
    {
      this.m_params = PigParams.join(_parent1.getParams(), _parent2.getParams());
    }
    else
    {
      this.m_params = new PigParams(300 + (Math.random() * 200));
    }
  }

  play()
  {
    var self = this;
    this.m_osc = this.m_ctx.createOscillator();
    this.m_osc.type = 'square';
    this.m_osc.frequency.setValueAtTime(this.m_params.getFrequency(),
                                        this.m_ctx.currentTime)x;
    this.m_osc.connect(this.m_ctx.destination);
    this.m_osc.start();
    setTimeout(
        function()
        {
          self.m_osc.stop();
          self.m_osc.disconnect();
        }, 1000);
  }

  getParams()
  {
    return this.m_params;
  }
}

class PigParams
{
  constructor(_freq)
  {
    this.m_freq = _freq;
  }

  getFrequency()
  {
    return this.m_freq;
  }

  static join(_param1, _param2)
  {
    var freq = lerp(_param1.getFrequency(), _param2.getFrequency(), 0.5);
    console.log(freq);
    return new PigParams(freq);
  }

}
