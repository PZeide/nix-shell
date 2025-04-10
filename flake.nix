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

        astalLibraries = with ags.packages.${system}; [
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
        ];
      in {
        packages = {
          default = ags.lib.bundle {
            inherit pkgs;
            src = ./.;
            name = "zeide-shell";
            entry = "app.ts";
            gtk4 = true;

            extraPackages = astalLibraries;
          };
        };

        devShells = {
          default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              nodejs
            ];

            buildInputs = [
              (ags.packages.${system}.default.override {
                extraPackages = astalLibraries;
              })
            ];
          };
        };
      }
    );
}
