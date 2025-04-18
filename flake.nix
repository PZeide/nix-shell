{
  description = "Zeide's shell configuration | @PZeide";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    ags,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachSystem ["x86_64-linux" "aarch64-linux"] (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

        extraPackages =
          (with ags.packages.${system}; [
            io
            astal4
            apps
            battery
            bluetooth
            hyprland
            mpris
            network
            notifd
            powerprofiles
            tray
            wireplumber
          ])
          ++ (with pkgs; [
            dart-sass
          ]);
      in {
        packages = {
          default = ags.lib.bundle {
            inherit pkgs extraPackages;
            src = ./src;
            name = "zeide-shell";
            entry = "app.ts";
            gtk4 = true;
          };
        };

        devShells = {
          default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              nodejs
              icon-library
            ];

            buildInputs = [
              (ags.packages.${system}.default.override {
                inherit extraPackages;
              })
            ];

            shellHook = ''
              if [ ! -d "@girs" ]; then
                ${pkgs.lib.getExe ags.packages.${system}.default} types -d .
              fi
            '';
          };
        };
      }
    );
}
