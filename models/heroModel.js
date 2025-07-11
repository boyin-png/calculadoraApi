export default class Hero {
    // El constructor ahora acepta y asigna las 5 propiedades
    constructor({id, name, power, age, city}) {
        this.id = id;
        this.name = name;
        this.power = power; // Para tu proyecto: podría ser "generoMusical"
        this.age = age;     // Para tu proyecto: podría ser "añoLanzamiento"
        this.city = city;  // Para tu proyecto: podría ser "ciudadDeOrigen"
    }
}