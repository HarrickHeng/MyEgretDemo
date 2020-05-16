var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BallType;
(function (BallType) {
    BallType[BallType["foot"] = 0] = "foot";
    BallType[BallType["basket"] = 1] = "basket";
    BallType[BallType["base"] = 2] = "base";
})(BallType || (BallType = {}));
/**生成器 */
var BallGenerator = (function () {
    function BallGenerator(val) {
        this._dis = null;
        this.init(val);
    }
    BallGenerator.prototype.init = function (val) {
        this._dis = val;
    };
    BallGenerator.prototype.getBall = function (type) {
        var vo = this._dis.getVO(type);
        if (vo == null) {
            //clear new HashObject
            vo = this.createVO(type);
            this._dis.addVO(vo);
            vo.reset();
        }
        return vo;
    };
    BallGenerator.prototype.createVO = function (type) {
        switch (type) {
            case BallType.foot:
                return new FootBall();
            case BallType.basket:
                return new BasketBall();
            case BallType.base:
                return new BaseBall();
        }
    };
    BallGenerator.prototype.look = function () {
        this._dis.look();
    };
    return BallGenerator;
}());
__reflect(BallGenerator.prototype, "BallGenerator");
//# sourceMappingURL=IBall.js.map