class PigParams
{
    constructor(_pos=null, _noteArr=null)
    {
        this.m_song = [];

        if(_noteArr)
        {
            this.m_song = _noteArr;
        }
        else
        {
            // this.m_song.push(NOTES.E);
            // this.m_song.push(NOTES.A);
            // this.m_song.push(NOTES.C);
            this.m_song.push(firstNotes[0]);
            this.m_song.push(firstNotes[1]);
            this.m_song.push(firstNotes[2]);

        }
        this.m_songLength = this.m_song.length;
        this.m_songIndex = 0;


        this.m_startPos = _pos;

    }

    getPosition ()
    {
        return this.m_startPos;
    }

    static join(_par1, _par2, _pos)
    {
        var song = [];
        var len = (_par1.getLength() + _par2.getLength())/2;

        var mutationLen = percent();

        if(mutationLen < 20)
        {
            var ranDir = percent();
            if(ranDir < 40)
            {
                len = Math.max(1, len - 1);
            }
            else
            {
                len = Math.min(6, len + 1);
            }
        }

        for(var i = 0; i < len; i ++)
        {
            var candidates = [];
            var note;
            if(i < _par1.getLength())
            {
                candidates.push(_par1.getNote(i));
            }

            if(i < _par2.getLength())
            {
                candidates.push(_par2.getNote(i));
            }

            var noteMutation = percent();

            if(candidates.length > 0 && noteMutation > 20)
            {
                note = candidates[Math.floor(Math.random() * candidates.length)];
            }
            else
            {
                note = NOTES.noteArray[Math.floor(Math.random() * candidates.length)];
            }

            song.push(note);
        }

        return new PigParams(_pos, song);
    }

    getSong()
    {
        return this.m_song;
    }

    getLength()
    {
        return this.m_songLength;
    }

    getNote(_ndx)
    {
        return this.m_song[_ndx];
    }

    getNextNote()
    {
        if(this.m_songIndex < this.m_song.length)
        {
            var n = this.m_song[this.m_songIndex];
            this.m_songIndex ++;
            return n;
        }
        else
        {
            this.m_songIndex = 0;
            return null;
        }
    }

    getSong()
    {
        return this.m_song;
    }



}
