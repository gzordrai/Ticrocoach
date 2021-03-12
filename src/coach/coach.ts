export class Coach {
    id: string;
    lanes: string[] = new Array();
    ranks: string[] = new Array();
    divisions: string[] = new Array();
    specialties: string[] = new Array();
    description: string = "";
    champions: string[] = new Array();

    constructor(id: string) {
        this.id = id;
    }

    public reset(step: number): void {
        switch(step) {
            case 0: this.lanes = new Array(); break;
            case 1: this.ranks = new Array(); break;
            case 2: this.divisions = new Array(); break;
            case 3: this.specialties = new Array(); break;
        }
    }

    public get_id(): string {
        return this.id;
    }

    public add_lane(lane: string): void {
        this.lanes.push(lane);
    }

    public get_lane(): string[] {
        return this.lanes;
    }

    public add_rank(rank: string): void {
        this.ranks.push(rank);
    }

    public get_rank(): string[] {
        return this.ranks;
    }

    public add_division(division: string): void {
        this.divisions.push(division);
    }

    public add_specialty(specialty: string): void {
        this.specialties.push(specialty);
    }

    public get_specialty(): string[] {
        return this.specialties;
    }

    public set_description(description: string): void {
        this.description = description;
    }

    public get_description(): string {
        return this.description;
    }
}