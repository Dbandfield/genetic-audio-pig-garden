class Logger
{
    constructor(_el1, _el2, _el3)
    {
            this.m_element1 = _el1;
            this.m_element2 = _el2;
            this.m_element3 = _el3;

            this.m_str1 = "";
            this.m_str2 = "";
            this.m_str3 = "";

    }

    log(_str)
    {
        console.log(_str + "-> " + this.m_str1 + this.m_str2 + this.m_str3);
        this.m_str3 = this.m_str2;
        this.m_str2 = this.m_str1;
        this.m_str1 = _str;
        this.m_element1.innerHTML = this.m_str1;
        this.m_element2.innerHTML = this.m_str2;
        this.m_element3.innerHTML = this.m_str3;
    }
}
