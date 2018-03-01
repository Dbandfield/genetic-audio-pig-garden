"use strict";

class PigParams
{
    constructor(_freq)
    {
        this.m_frequency = _freq;
    }

    static join(_par1, _par2)
    {
        return PigParams(lerp(_par1.getFrequency(),
                                _par2.getFrequency(),
                                0.5));
    }

    getFrequency()
    {
        return this.m_frequency;
    }

}
