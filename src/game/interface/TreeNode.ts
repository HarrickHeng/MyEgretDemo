/**二叉树排序 */
class TreeNode {
    public key: number;
    public left: TreeNode;
    public right: TreeNode;

    constructor(key: number) {
        this.key = key;
    }
}

class SearchTree {
    /**根节点 */
    private root: TreeNode;

    public insert(key: number) {
        const newNode = new TreeNode(key);
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let p = this.root;
        while (1) {
            if (p.key > key) {
                //左节点
                if (p.left)
                    p = p.left;
                else {
                    p.left = newNode;
                    return;
                }
            } else {
                //右节点
                if (p.right)
                    p = p.right
                else {
                    p.right = newNode;
                    return;
                }
            }
        }
    }

    /**中序遍历 */
    public inOrderTraversal() {
        const result = [];
        const stack = [];
        let p = this.root;

        while (p || stack.length > 0) {
            while (p) {
                stack.push(p);
                p = p.left;
            }
            if (stack.length > 0) {
                p = stack.pop();
                result.push(p.key);
                p = p.right;
            }
        }

        return result;
    }

    /**前序遍历 */
    public preOrderTraversal() {
        const result = [];
        const stack = [];
        let p = this.root;

        while (p || stack.length > 0) {
            while (p) {
                result.push(p.key);
                stack.push(p);
                p = p.left;
            }
            if (stack.length > 0) {
                stack.pop();
                p = p.right;
            }
        }

        return result;
    }

    /**后序排序 */
    public postOrderTraversal() {
        const result = [];
        const stack = [];
        let p = this.root;

        while (p || stack.length > 0) {
            while (p) {
                stack.push({
                    node: p,
                    flag: false,
                });
                p = p.left;
            }
            if (stack.length > 0) {
                const top = stack[stack.length - 1];
                if (top.node.right && top.flag === false) {
                    p = top.node.right;
                }
                if (top.flag) {
                    result.push(stack.pop().key);
                } else {
                    top.flag = true;
                }
            }
        }

        return result;
    }

    /**最小值 */
    public getMinNode() {
        return this.findMinNode();
    }

    /**最大值 */
    public getMaxNode() {
        return this.findMaxNode();
    }

    private findMinNode() {
        let p = this.root;
        while (p.left) {
            p = p.left;
        }
        return p;
    }

    private findMaxNode() {
        let p = this.root;
        while (p.right) {
            p = p.right;
        }
        return p;
    }
}