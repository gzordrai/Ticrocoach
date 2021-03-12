export class Coach {
    id: string;
    lanes: string[] = new Array();
    ranks: string[] = new Array();
    divisions: string[] = new Array();
    specialties: string[] = new Array();
    description: string = "";

    constructor(id: string) {
        this.id = id;
    }

    reset(step: number) {
        switch(step) {
            case 0: this.lanes = new Array(); break;
            case 1: this.ranks = new Array(); break;
            case 2: this.divisions = new Array(); break;
            case 3: this.specialties = new Array(); break;
        }
    }

    get_id() {
        return this.id;
    }

    add_lane(lane: string) {
        this.lanes.push(lane);
    }

    get_lane() {
        return this.lanes;
    }

    add_rank(rank: string) {
        this.ranks.push(rank);
    }

    get_rank() {
        return this.ranks;
    }

    add_division(division: string): void {
        this.divisions.push(division);
    }

    add_specialty(specialty: string) {
        this.specialties.push(specialty);
    }

    get_specialty() {
        return this.specialties;
    }

    set_description(description: string) {
        this.description = description;
    }

    get_description() {
        return this.description;
    }
}