using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastracture.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTypeForeignKeyToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserTypeId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.Sql(
                @"IF NOT EXISTS (SELECT 1 FROM [UserTypes])
                  BEGIN
                      INSERT INTO [UserTypes] ([Name]) VALUES (N'Customer');
                  END");

            migrationBuilder.Sql(
                @"UPDATE [Users]
                  SET [UserTypeId] = (SELECT TOP(1) [Id] FROM [UserTypes] ORDER BY [Id])
                  WHERE [UserTypeId] IS NULL");

            migrationBuilder.AlterColumn<int>(
                name: "UserTypeId",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserTypeId",
                table: "Users",
                column: "UserTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserTypes_UserTypeId",
                table: "Users",
                column: "UserTypeId",
                principalTable: "UserTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserTypes_UserTypeId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserTypeId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserTypeId",
                table: "Users");
        }
    }
}
