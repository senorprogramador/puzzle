export const createThemeCss = (variables: Record<string, string>) => {
  const declarations = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${declarations}\n`;
};
