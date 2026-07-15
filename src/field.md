import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'fieldconfigs' })
export class FieldConfig extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  fieldName: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, default: 'General' })
  section: string;

  @Prop({ default: '' })
  scriptName: string;

  @Prop({ type: Types.ObjectId, ref: 'TestCase' })
  scriptId: Types.ObjectId;

  @Prop({ required: true })
  selector: string;

  @Prop({ default: '' })
  xpath: string;

  @Prop({ required: true, enum: ['fill', 'click', 'select', 'check', 'press', 'wait', 'goto', 'assert', 'clickIfVisible', 'uploadFile', 'hover', 'scroll', 'dblclick', 'captureAppNumber', 'screenshot'], default: 'fill' })
  actionType: string;

  @Prop({ enum: ['text', 'number', 'select', 'checkbox', 'radio', 'date', 'file', 'password', 'email', 'tel'], default: 'text' })
  inputType: string;

  @Prop({ type: [String], default: [] })
  selectOptions: string[];

  @Prop({ default: '' })
  defaultValue: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ default: false })
  isRequired: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isSkipped: boolean;

  @Prop({ default: '' })
  captureAs: string;

  @Prop({ type: [{ type: Object }], default: [] })
  conditions: { ref: string; equals: string }[];

  @Prop({ enum: ['visible', 'hidden', 'hasText', 'hasValue', 'containsText', 'enabled', 'disabled', ''], default: '' })
  assertType: string;

  @Prop({ default: '' })
  expectedValue: string;
}

export const FieldConfigSchema = SchemaFactory.createForClass(FieldConfig);
FieldConfigSchema.index({ projectId: 1, isActive: 1, order: 1 });
