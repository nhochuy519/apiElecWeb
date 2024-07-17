class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let objQuery = { ...this.queryString };
    const excludeFields = ["page", "limit"];
    console.log(objQuery);
    excludeFields.forEach((item) => delete objQuery[item]);

    if (this.queryString.name) {
      console.log("thực hiện truy vấn name");
      objQuery.name = { $regex: this.queryString.name, $options: "i" };
    }

    this.query = this.query.find(objQuery);

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

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
