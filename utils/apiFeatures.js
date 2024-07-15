class APIFeatures {
  constructor(query, queryString) {
    // product.find(), req.query
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let objQuery = { ...this.queryString };
    // console.log(objQuery);
    const excludeFiels = ["name"];
    excludeFiels.forEach((item) => delete objQuery[item]);
    if (this.queryString.name) {
      objQuery = { name: { $regex: this.queryString.name, $options: "i" } };
    }

    this.query = this.query.find(objQuery);

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
