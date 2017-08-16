module.exports = function(sequelize, DataTypes) {
	var Burger = sequelize.define("Burger", {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		devoured: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	},{
		classMethods: {
			associate: function(models) {
				Burger.belongsTo(models.Customer, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: true
					}
				});
			}
		}
	});
	return Burger;
};