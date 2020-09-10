function Robot() {
  this.name = Robot.makeId();
}

Robot.nums = Array.from({ length: 10 }, (_, i) => i);
Robot.chars = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
Robot.idmap = {};

Robot.makeId = function () {
  var text = Array.from({ length: 2 }, _ => Robot.chars[~~(Math.random() * 26)]).join("") +
    Array.from({ length: 3 }, _ => Robot.nums[~~(Math.random() * 10)]).join("");
  return !Robot.idmap[text] ? (Robot.idmap[text] = true, text) : Robot.makeId();
};

module.exports.genereHash = function robotFactory(n) {
  a = [];
  for (var i = 0; i < n; i++) a.push(new Robot());
  return a;
}

