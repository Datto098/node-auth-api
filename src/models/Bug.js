class Bug {
    constructor(parameters) {
        this.id = parameters.id;
        this.title = parameters.title;
        this.description = parameters.description;
    }

    toObject() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
        };
    }
}

module.exports = Bug;