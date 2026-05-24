import { studentService } from './real';

export async function updateStudentSanction(
  id,
  active,
  sanctionEndDate = null,
) {
  return studentService.updateSanction(id, active, sanctionEndDate);
}
