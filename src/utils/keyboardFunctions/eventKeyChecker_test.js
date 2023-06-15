import {expect} from '@open-wc/testing';
import { isArrowKey, isMenuNavigationKey } from './eventKeyChecker';

describe('test eventKeyChecker()', async ()=> {
    it('should return true when key is "ArrowUp", "ArrowDown", "ArrowLeft" or "ArrowRight"', async ()=> {
        expect(isArrowKey('ArrowUp')).true;
        expect(isArrowKey('ArrowDown')).true;
        expect(isArrowKey('ArrowLeft')).true;
        expect(isArrowKey('ArrowRight')).true;
    });
    it('should return false when key is not "ArrowUp", "ArrowDown", "ArrowLeft" or "ArrowRight"', async ()=> {
        expect(isArrowKey('Arrowup')).false;
        expect(isArrowKey('Enter')).false;
        expect(isArrowKey('')).false;
        expect(isArrowKey(null)).false;
    });
});

describe('test isMenuNavigationKey()', async ()=> {
    it('should return true when key is "ArrowUp", "ArrowDown", "Enter" or " "', async ()=> {
        expect(isMenuNavigationKey('ArrowUp')).true;
        expect(isMenuNavigationKey('ArrowDown')).true;
        expect(isMenuNavigationKey('Enter')).true;
        expect(isMenuNavigationKey(' ')).true;
    });
    it('should return false when key is not "ArrowUp", "ArrowDown", "Enter" or " "', async ()=> {
        expect(isMenuNavigationKey('Arrowup')).false;
        expect(isMenuNavigationKey('ArrowRight')).false;
        expect(isMenuNavigationKey('')).false;
        expect(isMenuNavigationKey(null)).false;
    });
})