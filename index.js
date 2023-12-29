(() => {

let groupIdx = 0;
let testGroups = [];

function cleanAllTest() {
    testGroups = [];
    groupIdx = 0;
}

async function runTest(printCb = console.log) {
    for await (let testGroup of testGroups) {
        const { name, testCases } = testGroup;
        const isGroupTest = name !== 'no-group'
        if(isGroupTest) {
          printCb("> Group: ", name);
        }
        
        for await (let unitTest of testCases) {
            let errMessage = false;
            let testFlag = "(V)"
            try {
                const res = await unitTest.testCb();
            } catch (error) {
                errMessage = error.message;
                testFlag = "(X)";
            } finally {
                printCb(`${isGroupTest ? '>>>>'  : ''}${testFlag}Test:  ${unitTest.testName}`);
                errMessage && printCb(`  ------Failed in: ${errMessage}------`);
            }
        }
    }
    cleanAllTest()
}
function cleanAllTest() {
    testGroups = [];
    groupIdx = 0;
}

  function expect(input) {
      let _reverseMatch = false
      return ({
          isEqual(output) {
              const res = _reverseMatch ? JSON.stringify(input) !== JSON.stringify(output) : JSON.stringify(input) === JSON.stringify(output);
              if(res) {
                  return true;
              };
              throw new Error(`Test failed: ${input} no equal to ${output}`);
          },
          get not() {
            _reverseMatch = true
            return this
          },
      })
  }

let isInGroup = false;
function group(groupName = '', cb) {
    isInGroup = true;
    testGroups.push({
        name: groupName,
        testCases: [],
    });
    cb();
    groupIdx++;
    isInGroup = false;
}

function test(testName = '', testCb) {
  if(isInGroup) {
    testGroups[groupIdx].testCases.push({
        testName,
        testCb,
    });
    return;
  };

  testGroups.push({
    name: 'no-group',
    testCases: [],
  })
  testGroups[groupIdx].testCases.push({
    testName,
    testCb,
  })
  groupIdx++;
}

// append to window
window.testSuite = {};
window.testSuite.group = group;
window.testSuite.test = test;
window.testSuite.expect = expect;
window.testSuite.runTest = runTest;

// write some sample test...
// group("test group 1", () => {
//   test("test avg", () => {
//     const avg = (arr = []) => arr.reduce((p, n) => p + n, 0) / arr.length;
//     expect(avg([1, 2, 3])).isEqual(2);
//   })

//   test("test sum", () => {
//     const sum = (arr = []) => arr.reduce((p, n) => p + n, 0);

//     expect(sum([1, 2, 3])).isEqual(6);
//   })
  
//   test("test sum(failed)", () => {
//     const sum = (arr = []) => arr.reduce((p, n) => p + n, 0);

//     expect(sum([1, 2, 3])).isEqual(7);
//   })
// })
// test("outer test sum", () => {
//     const sum = (arr = []) => arr.reduce((p, n) => p + n, 0);

//     expect(sum([1, 2, 3])).isEqual(7);
//   });
// group("test group 2", () => {
//   test("test avg", () => {
//     const avg = (arr = []) => arr.reduce((p, n) => p + n, 0) / arr.length;
//     expect(avg([1, 2, 3])).isEqual(2);
//   })

//   test("test sum", () => {
//     const sum = (arr = []) => arr.reduce((p, n) => p + n, 0);

//     expect(sum([1, 2, 3])).isEqual(6);
//   })
  
//   test("test sum(failed)", () => {
//     const sum = (arr = []) => arr.reduce((p, n) => p + n, 0);

//     expect(sum([1, 2, 3])).isEqual(7);
//   })
// })
// runTest()
})()
