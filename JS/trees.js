// create binary tree

class Node {
  constructor(item) {
    this.data = item;
    this.left = this.right = null;
  }
}

let first = new Node(1);
let second = new Node(2);
let third = new Node(3);

first.left = second;
first.right = third;

const printOrderPreOrder = (head) => {
  if (!head) return null;
  console.log(head.data, " ");
  if (head.left) {
    printOrderPreOrder(head.left);
  }
  if (head.right) {
    printOrderPreOrder(head.right);
  }
};

const printInOrder = (head) => {
  if (!head) return;
  if (head.left) printOrderPreOrder(head.left);
  console.log(head.data);
  if (head.right) {
    printOrderPreOrder(head.right);
  }
};

printOrderPreOrder(first);

console.log("In order");

printInOrder(first);
