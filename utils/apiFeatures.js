class APIFeatures {
  constructor(query, queryString) {
    // product.find(), req.query
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let objQuery = { ...this.queryString };
    const excludeFiels = ["name", "random"];
    excludeFiels.forEach((item) => delete objQuery[item]);
    if (this.queryString.q) {
      objQuery = { name: { $regex: this.queryString.q, $options: "i" } };
    }

    this.query = this.query.find();

    return this;
  }
  // async random() {
  //   if (this.queryString.limit) {
  //     // const count = await this.query.model.countDocuments();
  //     // const skip = Math.floor(Math.random() * count) - +this.queryString.random;

  //     console.log(typeof +this.queryString.limit);
  //     this.query = this.query.skip(0).limit(+this.queryString.limit);

  //     return this;
  //   }
  // }
}

module.exports = APIFeatures;
