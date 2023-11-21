import { Personaje } from "./personaje.js";

export class Monstruo extends Personaje {

    constructor(id, nombre, tipo, miedo, defensa, alias) {
        super(id, nombre, tipo);
        this.miedo = miedo;
        this.defensa = defensa;
        this.alias = alias;
    }

}