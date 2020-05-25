var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ToolInstance = (function () {
    function ToolInstance() {
    }
    /**
     * 停止鼠标冒泡事件
     */
    ToolInstance.stopTouchEvent = function () {
        var childs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            childs[_i] = arguments[_i];
        }
        for (var _a = 0, childs_1 = childs; _a < childs_1.length; _a++) {
            var child = childs_1[_a];
            child.addEventListener(egret.TouchEvent.TOUCH_TAP, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_BEGIN, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_END, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_MOVE, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_CANCEL, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, ToolInstance.stopTouch, child);
        }
    };
    ToolInstance.removeStopTouch = function () {
        var childs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            childs[_i] = arguments[_i];
        }
        for (var _a = 0, childs_2 = childs; _a < childs_2.length; _a++) {
            var child = childs_2[_a];
            child.removeEventListener(egret.TouchEvent.TOUCH_TAP, ToolInstance.stopTouch, child);
            child.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, ToolInstance.stopTouch, child);
            child.removeEventListener(egret.TouchEvent.TOUCH_END, ToolInstance.stopTouch, child);
            child.removeEventListener(egret.TouchEvent.TOUCH_MOVE, ToolInstance.stopTouch, child);
            child.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, ToolInstance.stopTouch, child);
            child.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, ToolInstance.stopTouch, child);
        }
    };
    ToolInstance.stopTouch = function (evt) {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
    };
    /**
     * 转换不同容器之间的点
     */
    ToolInstance.changePoint = function (x, y, localContainer, targetContainer) {
        var po = localContainer.localToGlobal(x, y);
        var po1 = targetContainer.globalToLocal(po.x, po.y);
        return po1;
    };
    /**
     * 计算两点长度
     */
    ToolInstance.distance = function (sx, sy, ex, ey) {
        var dx = Math.abs(ex - sx);
        var dy = Math.abs(ey - sy);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };
    /**
     * 计算固定距离的值
     */
    ToolInstance.countDistanceTarget = function (orgin, target, dis) {
        var _dis = target - orgin;
        if (Math.abs(_dis) > dis) {
            if (_dis > 0) {
                return orgin + dis;
            }
            else {
                return orgin - dis;
            }
        }
        return target;
    };
    /**
     * 判断显示对象是否可见
     */
    ToolInstance.checkVisible = function (displayObj) {
        if (!displayObj.stage || !displayObj.visible || displayObj.alpha == 0) {
            return false;
        }
        var parent = displayObj.parent;
        while (parent && parent != egret.MainContext.instance.stage) {
            if (!parent.visible || parent.alpha == 0) {
                return false;
            }
            parent = parent.parent;
        }
        return true;
    };
    /**
     * 一元二次方程求解
     */
    ToolInstance.sqrtRoot = function (a, b, c) {
        var result = new Object();
        var res1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var res2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        result["plus"] = res1;
        result["Less"] = res2;
        var res = Math.max(res1, res2);
        result["uint"] = res > 0 ? res : undefined;
        res = Math.min(res1, res2);
        result["negt"] = res < 0 ? res : undefined;
        return result;
    };
    /**计算勾股c */
    ToolInstance.countC = function (a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };
    /**
     * 检测矩形是否包含指定点
     */
    ToolInstance.checkContains = function (rect, x, y) {
        var w = rect.width > 0 ? rect.width : 1;
        var h = rect.height > 0 ? rect.height : 1;
        if (rect.x <= x && rect.y <= y && x < rect.x + w && y < rect.y + h) {
            return true;
        }
        return false;
    };
    /**
     * 移除所有子对象
     */
    ToolInstance.removeAllChild = function () {
        var containers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            containers[_i] = arguments[_i];
        }
        for (var _a = 0, containers_1 = containers; _a < containers_1.length; _a++) {
            var target = containers_1[_a];
            while (target.numChildren) {
                target.removeChildAt(0);
            }
        }
    };
    ToolInstance.checkArray = function (ary1, ary2, value) {
        if (!ary1 || !ary2) {
            return false;
        }
        if (value) {
            ary1.sort(function (a, b) {
                if (a[value] > b[value]) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
            ary2.sort(function (a, b) {
                if (a[value] > b[value]) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
            if (JSON.stringify(ary1) == JSON.stringify(ary2)) {
                return true;
            }
            else {
                return false;
            }
        }
        for (var _i = 0, ary1_1 = ary1; _i < ary1_1.length; _i++) {
            var obj = ary1_1[_i];
            if (ary2.indexOf(obj) == -1) {
                return false;
            }
        }
        return true;
    };
    /**
     * 获取点击的子对象
     */
    ToolInstance.getTouchItem = function (group, stageX, stageY, classType, childx, childy) {
        var i, child, ds = Number.MAX_VALUE, target, midx, midy;
        var point = group.globalToLocal(stageX, stageY);
        for (i = 0; i < group.numChildren; i++) {
            child = group.getChildAt(i);
            if (classType == undefined || child instanceof classType) {
                if (childx != undefined && childy != undefined) {
                    midx = childx;
                    midy = childy;
                }
                else if (child instanceof eui.Component) {
                    midx = child.x + (child.skin.width ? child.skin.width : child.width) / 2;
                    midy = child.y + (child.skin.height ? child.skin.height : child.height) / 2;
                }
                else {
                    midx = child.x + child.width / 2;
                    midy = child.y + child.height / 2;
                }
                var _d = ToolInstance.distance(midx, midy, point.x, point.y);
                if (ds > _d) {
                    ds = _d;
                    target = child;
                }
            }
        }
        return target;
    };
    ToolInstance.version = "1.3";
    return ToolInstance;
}());
__reflect(ToolInstance.prototype, "ToolInstance");
//# sourceMappingURL=ToolInstance.js.map