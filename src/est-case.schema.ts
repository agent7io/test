import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TestCaseType } from '../../common/constants';

@Schema({ timestamps: true, collection: 'testCases' })
export class TestCase extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Release' })
  releaseId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: TestCaseType })
  type: TestCaseType;

  @Prop()
  module: string;

  @Prop()
  page: string;

  @Prop({ enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' })
  priority: string;

  @Prop({ type: [{ step: String, action: String, expected: String, selector: String }] })
  steps: { step: string; action: string; expected: string; selector: string }[];

  @Prop({ type: Object })
  testData: Record<string, any>;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: false })
  isAutomated: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const TestCaseSchema = SchemaFactory.createForClass(TestCase);
TestCaseSchema.index({ projectId: 1, type: 1, isDeleted: 1 });
TestCaseSchema.index({ projectId: 1, module: 1 });
