import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/password';

async function main() {
  console.log('🌱 Seeding database...');

  // Crear Admin
  const adminPassword = await hashPassword('admin2026');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hackesjobs.com.mx' },
    update: {},
    create: {
      name: 'Administrador Principal',
      email: 'admin@hackesjobs.com.mx',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Crear Empresa Demo
  const companyPassword = await hashPassword('empresa2026');
  const companyUser = await prisma.user.upsert({
    where: { email: 'demo@techcorp.mx' },
    update: {},
    create: {
      name: 'Carlos Martínez',
      email: 'demo@techcorp.mx',
      passwordHash: companyPassword,
      role: 'company',
      company: {
        create: {
          name: 'TechCorp México',
          industry: 'Tecnología',
          size: '51-200',
          verified: true,
        },
      },
    },
  });
  console.log('✅ Empresa demo creada:', companyUser.email);

  // Crear Candidato Demo
  const candidatePassword = await hashPassword('candidato2026');
  const candidateUser = await prisma.user.upsert({
    where: { email: 'juan@email.com' },
    update: {},
    create: {
      name: 'Juan Pérez',
      email: 'juan@email.com',
      passwordHash: candidatePassword,
      role: 'candidate',
      candidate: {
        create: {
          experienceYears: 5,
          skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
          education: 'Licenciatura',
          phone: '+52 55 1234 5678',
          bio: 'Desarrollador Full Stack con 5 años de experiencia en startups fintech.',
        },
      },
    },
  });
  console.log('✅ Candidato demo creado:', candidateUser.email);

  // Crear Recruiter Demo
  const recruiterPassword = await hashPassword('recruiter2026');
  const recruiter = await prisma.user.upsert({
    where: { email: 'reclutador@hackesjobs.com.mx' },
    update: {},
    create: {
      name: 'Ana García',
      email: 'reclutador@hackesjobs.com.mx',
      passwordHash: recruiterPassword,
      role: 'recruiter',
    },
  });
  console.log('✅ Recruiter creado:', recruiter.email);

  // Las vacantes ya no viven en la base de datos.
  // Fuente de verdad: `src/data/vacantes.ts` (catálogo file-based, SEO-friendly).

  // Crear Test Psicométrico DISC
  await prisma.psychometricTest.upsert({
    where: { id: 'disc-default' },
    update: {},
    create: {
      id: 'disc-default',
      name: 'Test DISC',
      type: 'DISC',
      structure: JSON.stringify({
        description: 'Evaluación de perfil conductual DISC',
        categories: ['Dominancia', 'Influencia', 'Estabilidad', 'Cumplimiento'],
        questions: 28,
      }),
      duration: 15,
      active: true,
    },
  });
  console.log('✅ Test DISC creado');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Cuentas de prueba:');
  console.log('   Admin:      admin@hackesjobs.com.mx / admin2026');
  console.log('   Empresa:    demo@techcorp.mx / empresa2026');
  console.log('   Candidato:  juan@email.com / candidato2026');
  console.log('   Recruiter:  reclutador@hackesjobs.com.mx / recruiter2026');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
