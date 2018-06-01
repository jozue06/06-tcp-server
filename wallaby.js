module.exports = function () {

  return{

    files: ['./lib/**/*.js'],
    
    tests: ['./__test__/**/*.spec.js'],
    
    env: {
      type: 'node',
    },
    
    testFramework: 'jest',

  };
};