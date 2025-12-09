https://docs.re.video/api/2d/components/Txt for the text animtions class
yield* all(
  txtRef().text("Hello, World!", 2),
  txtRef().fontSize(20, 2),
);
like that