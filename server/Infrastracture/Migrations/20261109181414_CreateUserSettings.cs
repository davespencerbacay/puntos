using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastracture.Migrations
{
    /// <inheritdoc />
    public partial class CreateUserSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsProfilePrivate = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsDarkModeEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CanReceiveEmailNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsAutoLogoutEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsTwoFactorAuthenticationEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsLoginAlertsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsTransactionAlertsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    UserId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSettings_UserId",
                table: "UserSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSettings_UserId1",
                table: "UserSettings",
                column: "UserId1",
                unique: true,
                filter: "[UserId1] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSettings");
        }
    }
}
