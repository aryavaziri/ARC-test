import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, AllowNull, AfterCreate, Index } from "sequelize-typescript";
import { LookupInput } from "./Fields";

@Table({
  tableName: "Dependencies",
  timestamps: false,
})
export class Dependency extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => LookupInput)
  @Column(DataType.UUID)
  declare referenceFieldId: string;

  @ForeignKey(() => LookupInput)
  @Column(DataType.UUID)
  declare controllingFieldId: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    get() {
      const raw = this.getDataValue("referenceLineItemIds");
      try { return raw ? JSON.parse(raw) : [] } catch { return [] }
    },
    set(value: string[]) { this.setDataValue("referenceLineItemIds", JSON.stringify(value)) },
  })
  declare referenceLineItemIds: string[];

}
