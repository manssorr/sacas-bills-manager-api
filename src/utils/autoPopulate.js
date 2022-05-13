function autoPopulateAllFields(schema) {
  let paths = [];
  schema.eachPath((path, type) => {
    if (path == "_id") {
      return;
    }
    if (type.options.ref || type?.caster?.options.ref) {
      paths.push({ path: `${path}` });
    }
  });

  schema.pre("find", function (next) {
    this.populate(paths);
    next();
  });
  schema.pre("findOne", function (next) {
    this.populate(paths);
    next();
  });
}

module.exports = autoPopulateAllFields;
