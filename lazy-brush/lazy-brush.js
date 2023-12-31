var u = Object.defineProperty;
var d = (i, t, s) => t in i ? u(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var e = (i, t, s) => (d(i, typeof t != "symbol" ? t + "" : t, s), s);
function n(i) {
  return 1 - Math.sqrt(1 - Math.pow(i, 2));
}
class a {
  constructor(t, s) {
    e(this, "x");
    e(this, "y");
    this.x = t, this.y = s;
  }
  update(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  moveByAngle(t, s, r) {
    const h = t + Math.PI / 2;
    return r ? (this.x = this.x + Math.sin(h) * s * n(1 - r), this.y = this.y - Math.cos(h) * s * n(1 - r)) : (this.x = this.x + Math.sin(h) * s, this.y = this.y - Math.cos(h) * s), this;
  }
  equalsTo(t) {
    return this.x === t.x && this.y === t.y;
  }
  getDifferenceTo(t) {
    return new a(this.x - t.x, this.y - t.y);
  }
  getDistanceTo(t) {
    const s = this.getDifferenceTo(t);
    return Math.sqrt(Math.pow(s.x, 2) + Math.pow(s.y, 2));
  }
  getAngleTo(t) {
    const s = this.getDifferenceTo(t);
    return Math.atan2(s.y, s.x);
  }
  toObject() {
    return {
      x: this.x,
      y: this.y
    };
  }
}
const o = 30;
class c {
  constructor(t = {}) {
    e(this, "_isEnabled");
    e(this, "_hasMoved");
    e(this, "radius");
    e(this, "pointer");
    e(this, "brush");
    e(this, "angle");
    e(this, "distance");
    const s = t.initialPoint || { x: 0, y: 0 };
    this.radius = t.radius || o, this._isEnabled = t.enabled === !0, this.pointer = new a(s.x, s.y), this.brush = new a(s.x, s.y), this.angle = 0, this.distance = 0, this._hasMoved = !1;
  }
  enable() {
    this._isEnabled = !0;
  }
  disable() {
    this._isEnabled = !1;
  }
  isEnabled() {
    return this._isEnabled;
  }
  setRadius(t) {
    this.radius = t;
  }
  getRadius() {
    return this.radius;
  }
  getBrushCoordinates() {
    return this.brush.toObject();
  }
  getPointerCoordinates() {
    return this.pointer.toObject();
  }
  getBrush() {
    return this.brush;
  }
  getPointer() {
    return this.pointer;
  }
  getAngle() {
    return this.angle;
  }
  getDistance() {
    return this.distance;
  }
  brushHasMoved() {
    return this._hasMoved;
  }
  update(t, s = {}) {
    if (this._hasMoved = !1, this.pointer.equalsTo(t) && !s.both && !s.friction)
      return !1;
    if (this.pointer.update(t), s.both)
      return this._hasMoved = !0, this.brush.update(t), !0;
    if (this._isEnabled) {
      this.distance = this.pointer.getDistanceTo(this.brush), this.angle = this.pointer.getAngleTo(this.brush);
      const r = Math.round((this.distance - this.radius) * 10) / 10 > 0, h = s.friction && s.friction < 1 && s.friction > 0 ? s.friction : void 0;
      r && (this.brush.moveByAngle(
        this.angle,
        this.distance - this.radius,
        h
      ), this._hasMoved = !0);
    } else
      this.distance = 0, this.angle = 0, this.brush.update(t), this._hasMoved = !0;
    return !0;
  }
}
export {
  c as LazyBrush,
  a as LazyPoint
};
