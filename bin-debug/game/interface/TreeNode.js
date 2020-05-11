var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**二叉树排序 */
var TreeNode = (function () {
    function TreeNode(key) {
        this.key = key;
    }
    return TreeNode;
}());
__reflect(TreeNode.prototype, "TreeNode");
var SearchTree = (function () {
    function SearchTree() {
    }
    SearchTree.prototype.insert = function (key) {
        var newNode = new TreeNode(key);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        var p = this.root;
        while (1) {
            if (p.key > key) {
                //左节点
                if (p.left)
                    p = p.left;
                else {
                    p.left = newNode;
                    return;
                }
            }
            else {
                //右节点
                if (p.right)
                    p = p.right;
                else {
                    p.right = newNode;
                    return;
                }
            }
        }
    };
    /**中序遍历 */
    SearchTree.prototype.inOrderTraversal = function () {
        var result = [];
        var stack = [];
        var p = this.root;
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
    };
    /**前序遍历 */
    SearchTree.prototype.preOrderTraversal = function () {
        var result = [];
        var stack = [];
        var p = this.root;
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
    };
    /**后序排序 */
    SearchTree.prototype.postOrderTraversal = function () {
        var result = [];
        var stack = [];
        var p = this.root;
        while (p || stack.length > 0) {
            while (p) {
                stack.push({
                    node: p,
                    flag: false,
                });
                p = p.left;
            }
            if (stack.length > 0) {
                var top_1 = stack[stack.length - 1];
                if (top_1.node.right && top_1.flag === false) {
                    p = top_1.node.right;
                }
                if (top_1.flag) {
                    result.push(stack.pop().key);
                }
                else {
                    top_1.flag = true;
                }
            }
        }
        return result;
    };
    /**最小值 */
    SearchTree.prototype.getMinNode = function () {
        return this.findMinNode();
    };
    /**最大值 */
    SearchTree.prototype.getMaxNode = function () {
        return this.findMaxNode();
    };
    SearchTree.prototype.findMinNode = function () {
        var p = this.root;
        while (p.left) {
            p = p.left;
        }
        return p;
    };
    SearchTree.prototype.findMaxNode = function () {
        var p = this.root;
        while (p.right) {
            p = p.right;
        }
        return p;
    };
    return SearchTree;
}());
__reflect(SearchTree.prototype, "SearchTree");
//# sourceMappingURL=TreeNode.js.map