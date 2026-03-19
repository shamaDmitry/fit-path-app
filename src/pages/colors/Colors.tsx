type ColorToken = {
  name: string;
  var: string;
  foregroundVar: string;
};

type ColorGroup = {
  id: string;
  title: string;
  description: string;
  colors: ColorToken[];
};

const colorGroups: ColorGroup[] = [
  {
    id: "core",
    title: "Core Surface Tokens",
    description: "Primary layout and semantic interaction colors.",
    colors: [
      {
        name: "Background",
        var: "--color-background",
        foregroundVar: "--color-foreground",
      },
      {
        name: "Foreground",
        var: "--color-foreground",
        foregroundVar: "--color-background",
      },
      {
        name: "Card",
        var: "--color-card",
        foregroundVar: "--color-card-foreground",
      },
      {
        name: "Card Foreground",
        var: "--color-card-foreground",
        foregroundVar: "--color-card",
      },
      {
        name: "Popover",
        var: "--color-popover",
        foregroundVar: "--color-popover-foreground",
      },
      {
        name: "Popover Foreground",
        var: "--color-popover-foreground",
        foregroundVar: "--color-popover",
      },
      {
        name: "Primary",
        var: "--color-primary",
        foregroundVar: "--color-primary-foreground",
      },
      {
        name: "Primary Foreground",
        var: "--color-primary-foreground",
        foregroundVar: "--color-primary",
      },
      {
        name: "Secondary",
        var: "--color-secondary",
        foregroundVar: "--color-secondary-foreground",
      },
      {
        name: "Secondary Foreground",
        var: "--color-secondary-foreground",
        foregroundVar: "--color-secondary",
      },
      {
        name: "Muted",
        var: "--color-muted",
        foregroundVar: "--color-muted-foreground",
      },
      {
        name: "Muted Foreground",
        var: "--color-muted-foreground",
        foregroundVar: "--color-muted",
      },
      {
        name: "Accent",
        var: "--color-accent",
        foregroundVar: "--color-accent-foreground",
      },
      {
        name: "Accent Foreground",
        var: "--color-accent-foreground",
        foregroundVar: "--color-accent",
      },
      {
        name: "Destructive",
        var: "--color-destructive",
        foregroundVar: "--color-destructive-foreground",
      },
      {
        name: "Destructive Foreground",
        var: "--color-destructive-foreground",
        foregroundVar: "--color-destructive",
      },
      {
        name: "Border",
        var: "--color-border",
        foregroundVar: "--color-foreground",
      },
      {
        name: "Input",
        var: "--color-input",
        foregroundVar: "--color-foreground",
      },
      {
        name: "Ring",
        var: "--color-ring",
        foregroundVar: "--color-background",
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback Tokens",
    description: "Status palettes for success, warning, and info states.",
    colors: [
      {
        name: "Success",
        var: "--color-success",
        foregroundVar: "--color-success-foreground",
      },
      {
        name: "Success Foreground",
        var: "--color-success-foreground",
        foregroundVar: "--color-success",
      },
      {
        name: "Warning",
        var: "--color-warning",
        foregroundVar: "--color-warning-foreground",
      },
      {
        name: "Warning Foreground",
        var: "--color-warning-foreground",
        foregroundVar: "--color-warning",
      },
      {
        name: "Info",
        var: "--color-info",
        foregroundVar: "--color-info-foreground",
      },
      {
        name: "Info Foreground",
        var: "--color-info-foreground",
        foregroundVar: "--color-info",
      },
    ],
  },
  {
    id: "charts",
    title: "Chart Tokens",
    description: "Categorical colors used for data visualization.",
    colors: [
      {
        name: "Chart 1",
        var: "--color-chart-1",
        foregroundVar: "--color-background",
      },
      {
        name: "Chart 2",
        var: "--color-chart-2",
        foregroundVar: "--color-background",
      },
      {
        name: "Chart 3",
        var: "--color-chart-3",
        foregroundVar: "--color-background",
      },
      {
        name: "Chart 4",
        var: "--color-chart-4",
        foregroundVar: "--color-background",
      },
      {
        name: "Chart 5",
        var: "--color-chart-5",
        foregroundVar: "--color-background",
      },
    ],
  },
  {
    id: "sidebar",
    title: "Sidebar Tokens",
    description: "Dedicated colors for the sidebar navigation system.",
    colors: [
      {
        name: "Sidebar",
        var: "--color-sidebar",
        foregroundVar: "--color-sidebar-foreground",
      },
      {
        name: "Sidebar Foreground",
        var: "--color-sidebar-foreground",
        foregroundVar: "--color-sidebar",
      },
      {
        name: "Sidebar Primary",
        var: "--color-sidebar-primary",
        foregroundVar: "--color-sidebar-primary-foreground",
      },
      {
        name: "Sidebar Primary Foreground",
        var: "--color-sidebar-primary-foreground",
        foregroundVar: "--color-sidebar-primary",
      },
      {
        name: "Sidebar Accent",
        var: "--color-sidebar-accent",
        foregroundVar: "--color-sidebar-accent-foreground",
      },
      {
        name: "Sidebar Accent Foreground",
        var: "--color-sidebar-accent-foreground",
        foregroundVar: "--color-sidebar-accent",
      },
      {
        name: "Sidebar Border",
        var: "--color-sidebar-border",
        foregroundVar: "--color-sidebar-foreground",
      },
      {
        name: "Sidebar Ring",
        var: "--color-sidebar-ring",
        foregroundVar: "--color-sidebar",
      },
    ],
  },
];

const Colors = () => {
  return (
    <div className="space-y-8">
      {colorGroups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-semibold text-foreground">
              {group.title}
            </h2>

            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.colors.map((color) => {
              return (
                <article
                  key={color.var}
                  className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                >
                  <div
                    className="h-24 px-4 py-3 flex items-end justify-between"
                    style={{
                      backgroundColor: `var(${color.var})`,
                      color: `var(${color.foregroundVar})`,
                    }}
                  >
                    <span className="text-base font-semibold leading-none">
                      {color.name}
                    </span>

                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: `var(${color.foregroundVar})`,
                        borderColor: `var(${color.var})`,
                      }}
                    />
                  </div>

                  <div className="p-3 bg-muted/30 border-t">
                    <p className="text-sm font-mono text-foreground">
                      bg: {color.var}
                    </p>

                    <p className="text-sm font-mono text-muted-foreground mt-1">
                      text: {color.foregroundVar}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Colors;
