class Candidate
{
    constructor(name,color,voters)
    {
        this.name = name;
        this.color = color;
        this.voters = voters;
    }

    getName()
    {
        return this.name;
    }

    getColor()
    {
        return this.color;
    }

    getVoters()
    {
        return this.voters
    }

    setVoters(voters)
    {
        this.voters = voters;
    }
}