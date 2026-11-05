export declare const typographyDefaults: {
    readonly display1: {
        readonly size: 80;
        readonly lineHeight: 1.05;
        readonly weight: 300;
        readonly letterSpacing: -1.5;
        readonly font: "heading";
        readonly responsive: {
            readonly min: 40;
            readonly max: 80;
            readonly minViewport: 360;
            readonly maxViewport: 1440;
        };
    };
    readonly display2: {
        readonly size: 60;
        readonly lineHeight: 1.1;
        readonly weight: 300;
        readonly letterSpacing: -0.5;
        readonly font: "heading";
        readonly responsive: {
            readonly min: 36;
            readonly max: 60;
            readonly minViewport: 360;
            readonly maxViewport: 1200;
        };
    };
    readonly headline1: {
        readonly size: 48;
        readonly lineHeight: 1.15;
        readonly weight: 400;
        readonly letterSpacing: -0.5;
        readonly font: "heading";
        readonly responsive: {
            readonly min: 32;
            readonly max: 48;
            readonly minViewport: 360;
            readonly maxViewport: 1200;
        };
    };
    readonly headline2: {
        readonly size: 36;
        readonly lineHeight: 1.2;
        readonly weight: 400;
        readonly letterSpacing: -0.25;
        readonly font: "heading";
        readonly responsive: {
            readonly min: 28;
            readonly max: 36;
            readonly minViewport: 360;
            readonly maxViewport: 1024;
        };
    };
    readonly headline3: {
        readonly size: 28;
        readonly lineHeight: 1.25;
        readonly weight: 400;
        readonly letterSpacing: 0;
        readonly font: "heading";
        readonly responsive: {
            readonly min: 22;
            readonly max: 28;
            readonly minViewport: 360;
            readonly maxViewport: 900;
        };
    };
    readonly headline4: {
        readonly size: 20;
        readonly lineHeight: 1.3;
        readonly weight: 500;
        readonly letterSpacing: 0.15;
        readonly font: "heading";
    };
    readonly subtitle1: {
        readonly size: 16;
        readonly lineHeight: 1.5;
        readonly weight: 500;
        readonly letterSpacing: 0.15;
        readonly font: "heading";
    };
    readonly subtitle2: {
        readonly size: 14;
        readonly lineHeight: 1.43;
        readonly weight: 500;
        readonly letterSpacing: 0.1;
        readonly font: "heading";
    };
    readonly body1: {
        readonly size: 16;
        readonly lineHeight: 1.5;
        readonly weight: 400;
        readonly letterSpacing: 0.5;
        readonly font: "body";
    };
    readonly body2: {
        readonly size: 14;
        readonly lineHeight: 1.43;
        readonly weight: 400;
        readonly letterSpacing: 0.25;
        readonly font: "body";
    };
    readonly button: {
        readonly size: 14;
        readonly lineHeight: 1.43;
        readonly weight: 500;
        readonly letterSpacing: 0.5;
        readonly font: "body";
    };
    readonly caption: {
        readonly size: 12;
        readonly lineHeight: 1.4;
        readonly weight: 400;
        readonly letterSpacing: 0.4;
        readonly font: "body";
    };
    readonly overline: {
        readonly size: 10;
        readonly lineHeight: 1.6;
        readonly weight: 500;
        readonly letterSpacing: 1;
        readonly font: "body";
    };
};
export type TypographyStyle = keyof typeof typographyDefaults;
export type ResponsiveFontSize = {
    min: number;
    max: number;
    minViewport?: number;
    maxViewport?: number;
};
export declare function createFluidFontSize({ min, max, minViewport, maxViewport, }: ResponsiveFontSize): string;
