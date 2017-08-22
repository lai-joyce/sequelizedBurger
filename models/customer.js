module.exports = function(sequelize, DataTypes) {
  // Define the Customer Sequelize model
  var Customer = sequelize.define("Customer", 
    {
      // The name identifying the customer
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
      // burgerID: DataTypes.INTEGER
    });

  Customer.associate = function(models) {
    // Associating Customer with Burger
    // When a customer is deleted, also delete any associated burgers
    Customer.hasMany(models.Burger, {
      onDelete: "cascade"
    });
  };

  return Customer;
};