var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HeapMI = (function () {
    function HeapMI() {
    }
    HeapMI.prototype.adjustHeapFixup = function (array, i) {
        var j, temp;
        temp = array[i];
        j = (i - 1) / 2;
        while (j >= 0 && i != 0) {
            if (array[j] >= temp)
                break;
            array[i] = array[j];
            i = j;
            j = (i - 1) / 2;
        }
        array[i] = temp;
    };
    HeapMI.prototype.MaxHeapAddNumber = function (array, n, Num) {
        array[n] = Num;
        this.adjustHeapFixup(array, n);
    };
    return HeapMI;
}());
__reflect(HeapMI.prototype, "HeapMI");
//# sourceMappingURL=HeapMI.js.map