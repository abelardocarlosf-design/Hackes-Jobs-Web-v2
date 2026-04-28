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

  // Crear Vacantes Demo
  const company = await prisma.company.findFirst({ where: { userId: companyUser.id } });
  if (company) {
    const jobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'Buscamos un desarrollador frontend senior con experiencia en React y TypeScript para liderar nuestro equipo de producto.',
        salaryRange: '$45,000 - $60,000 MXN',
        location: 'CDMX',
        modality: 'Híbrido',
        status: 'approved',
        requirements: JSON.stringify({ skills: ['React', 'TypeScript', 'Next.js'], experience: 5, education: 'Licenciatura' }),
        positions: 2,
        companyId: company.id,
      },
      {
        title: 'Product Manager',
        description: 'Necesitamos un PM experimentado que pueda definir la estrategia de producto y coordinar equipos cross-funcionales.',
        salaryRange: '$50,000 - $70,000 MXN',
        location: 'Remoto',
        modality: 'Remoto',
        status: 'approved',
        requirements: JSON.stringify({ skills: ['Product Strategy', 'Agile', 'Data Analysis'], experience: 3, education: 'Licenciatura' }),
        positions: 1,
        companyId: company.id,
      },
      {
        title: 'DevOps Engineer',
        description: 'Ingeniero DevOps para automatizar infraestructura cloud y pipelines CI/CD.',
        salaryRange: '$40,000 - $55,000 MXN',
        location: 'Querétaro',
        modality: 'Presencial',
        status: 'pending',
        requirements: JSON.stringify({ skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], experience: 3, education: 'Licenciatura' }),
        positions: 1,
        companyId: company.id,
      },
    ];

    for (const job of jobs) {
      await prisma.job.create({ data: job });
    }
    console.log('✅ Vacantes demo creadas:', jobs.length);
  }

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
