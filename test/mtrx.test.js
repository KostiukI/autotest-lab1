// Unit tests for the Mtrx library

const { expect } = require("chai");
const Mtrx = require("mtrx");

describe("Mtrx library", () => {

  describe("creation", () => {
    it("creates a matrix from a 2D array", () => {
      const m = new Mtrx([[1, 2, 3], [4, 5, 6]]);
      expect(m.rows).to.equal(2);
      expect(m.cols).to.equal(3);
      expect(m.get(1, 2)).to.equal(6);
    });

    it("creates a diagonal matrix from a 1D array", () => {
      const m = new Mtrx([2, 4, 6]);
      expect(m).to.eql([[2, 0, 0], [0, 4, 0], [0, 0, 6]]);
    });

    it("creates a matrix filled with one value", () => {
      const m = new Mtrx(3, 4, 9);
      expect(m.rows).to.equal(3);
      expect(m.cols).to.equal(4);
      expect(m.get(2, 3)).to.equal(9);
    });

    it("creates a matrix from a function", () => {
      const m = new Mtrx(2, 3, (i, j) => i + j);
      expect(m).to.eql([[0, 1, 2], [1, 2, 3]]);
    });

    it("Mtrx.eye() builds an identity matrix", () => {
      expect(Mtrx.eye(3)).to.eql([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    });

    it("Mtrx.zeros() and Mtrx.ones() build filled matrices", () => {
      expect(Mtrx.zeros(2, 3)).to.eql([[0, 0, 0], [0, 0, 0]]);
      expect(Mtrx.ones(2, 2)).to.eql([[1, 1], [1, 1]]);
    });
  });

  describe("element access", () => {
    it("get(i, j) reads one element", () => {
      const m = new Mtrx([[1, 2], [3, 4]]);
      expect(m.get(1, 0)).to.equal(3);
      expect(m[1][0]).to.equal(3);
    });

    it("set(i, j, v) writes one element", () => {
      const m = new Mtrx(2, 2, 0);
      m.set(0, 1, 5);
      expect(m.get(0, 1)).to.equal(5);
    });
  });

  describe("properties", () => {
    it("det computes the determinant of a square matrix", () => {
      const m = new Mtrx([[1, 2, 0], [3, 4, 4], [5, 6, 3]]);
      expect(m.det).to.equal(10);
    });

    it("det is NaN for a non-square matrix", () => {
      const m = new Mtrx([[1, 2, 3], [4, 5, 6]]);
      expect(m.det).to.be.NaN;
    });

    it("rank counts independent rows", () => {
      const m = new Mtrx([[1, 0], [0, 0]]);
      expect(m.rank).to.equal(1);
    });
  });
  describe("arithmetic", () => {
    const a = new Mtrx([[1, 2], [3, 4]]);
    const b = new Mtrx([[5, 6], [7, 8]]);

    it("add() sums two matrices of the same shape", () => {
      expect(a.add(b)).to.eql([[6, 8], [10, 12]]);
      expect(Mtrx.add(a, b)).to.eql(a.add(b));
    });

    it("sub() subtracts two matrices of the same shape", () => {
      expect(a.sub(b)).to.eql([[-4, -4], [-4, -4]]);
    });

    it("mul() multiplies by a scalar", () => {
      expect(a.mul(3)).to.eql([[3, 6], [9, 12]]);
    });

    it("rightMul() multiplies matrix with another", () => {
      expect(a.rightMul(b)).to.eql([[19, 22], [43, 50]]);
    });

    it("add() rejects matrices of different shapes", () => {
      const wide = new Mtrx([[1, 2, 3], [4, 5, 6]]);
      expect(() => a.add(wide)).to.throw(Error);
    });
  });

  describe("transformations", () => {
    it("T() transposes the matrix", () => {
      const m = new Mtrx([[1, 2, 3], [4, 5, 6]]);
      expect(m.T()).to.eql([[1, 4], [2, 5], [3, 6]]);
    });

    it("cof(i, j) returns the matrix without row i and column j", () => {
      const m = new Mtrx([[1, 2], [3, 4]]);
      expect(m.cof(0, 0)).to.eql([[4]]);
    });

    it("inv() inverts a non-singular matrix", () => {
      const inv = new Mtrx([[1, 2], [3, 4]]).inv();
      expect(inv[0][0]).to.be.closeTo(-2, 1e-9);
      expect(inv[1][1]).to.be.closeTo(-0.5, 1e-9);
    });
  });

  describe("checks and errors", () => {
    it("isMtrx() accepts only real Mtrx objects", () => {
      const m = new Mtrx([[1, 2], [3, 4]]);
      expect(Mtrx.isMtrx(m)).to.be.true;
      expect(Mtrx.isMtrx([[1, 2], [3, 4]])).to.be.false;
      expect(Mtrx.isMtrxLike([[1, 2], [3, 4]])).to.be.true;
    });

    it("isDiag() and isSingular() classify matrices", () => {
      expect(Mtrx.isDiag(Mtrx.diag([2, 4]))).to.be.true;
      expect(Mtrx.isSingular(new Mtrx([[1, 2], [2, 4]]))).to.be.true;
    });

    it("inv() throws error on a singular matrix", () => {
      expect(() => new Mtrx([[1, 2], [2, 4]]).inv()).to.throw(Error);
    });

    it("inv() and compan() throw error on a non-square matrix", () => {
      const m = new Mtrx([[1, 2, 3], [4, 5, 6]]);
      expect(() => m.inv()).to.throw(Error);
      expect(() => m.compan()).to.throw(Error);
    });
  });
});