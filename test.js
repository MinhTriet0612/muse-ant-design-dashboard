/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  const ans = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      ans.push(nums[i]);
    }
  }
  return ans;
};

console.log(removeElement([3, 2, 2, 3], 3));
