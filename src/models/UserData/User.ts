import { Table, Column, Model, DataType, PrimaryKey, Default, BeforeSave, Index, ForeignKey, BelongsTo, AfterCreate } from "sequelize-typescript";
import bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";

@Table({
  tableName: "Users",
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare hpassword?: string;

  @Column(DataType.STRING)
  declare firstName?: string;

  @Column(DataType.STRING)
  declare lastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare profileImg?: string;

  @ForeignKey(() => UserRole)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare roleId: number;

  role?: UserRole;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, (await this.get({ plain: true })).hpassword);
  }

  // Hooks
  @BeforeSave
  static async hashPassword(user: User) {
    if (user.changed("hpassword") && user.hpassword) {
      const salt = await bcrypt.genSalt(10);
      user.hpassword = await bcrypt.hash(user.hpassword, salt);
    }
  }
  @AfterCreate
  static async notifyAdmin(user: User) {
    // await newUserRegiserForAdmin(user)
  }
}
