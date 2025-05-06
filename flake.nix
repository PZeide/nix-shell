{
  description = "Zeide's shell configuration (AGS v3) | @PZeide";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    ags = {
      url = "github:aylur/ags/v3";
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
        pname = "zeide-shell";
        entry = "./src/app.ts";

        astalPackages = with ags.packages.${system}; [
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

        extraPackages =
          astalPackages
          ++ (with pkgs; [
            libadwaita
            libsoup_3
            dart-sass
          ]);
      in {
        packages = {
          default = pkgs.stdenv.mkDerivation {
            name = pname;
            src = ./src;

            nativeBuildInputs =
              (with pkgs; [
                wrapGAppsHook
                gobject-introspection
              ])
              ++ ags.packages.${system}.default;

            buildInputs = extraPackages ++ [pkgs.gjs];

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin
              mkdir -p $out/share
              cp -r * $out/share
              ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

              runHook postInstall
            '';
          };
        };

        devShells = {
          default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              bun
              nodejs
              icon-library
            ];

            buildInputs = [
              (ags.packages.${system}.default.override {
                inherit extraPackages;
              })
            ];

            shellHook = ''
              export BIOME_BINARY="${pkgs.biome}/bin/biome"
            '';
          };
        };
      }
    );
}
