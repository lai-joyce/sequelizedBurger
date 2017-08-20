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
    
    Burger.belongsTo(models.Customer, {
      // foreignKey: {
      //   allowNull: false
      // }
    });
  };

	return Burger;
};