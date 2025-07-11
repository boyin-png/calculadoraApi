// models/petModel.js
export default class Pet {
    constructor({ id, name, animal, superpower, status = 'vivo', ownerId = null }) {
        this.id = id;
        this.name = name;
        this.animal = animal;
        this.superpower = superpower;
        this.status = status;
        this.ownerId = ownerId;
    }
}