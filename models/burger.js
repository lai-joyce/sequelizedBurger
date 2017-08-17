module.exports = function(sequelize, DataTypes) {
	var Burger = sequelize.define("Burger", {
		name: {
			type: DataTypes.STRING
			// allowNull: false
		},
		devoured: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});

	Burger.associate = function(models) {
    // We're saying that a Burger should belong to a Customer
    // A Burger can't be created without a Customer due to the foreign key constraint
    Burger.belongsTo(models.Customer, {
      // foreignKey: {
      //   allowNull: false
      // }
    });
  };

	return Burger;
};