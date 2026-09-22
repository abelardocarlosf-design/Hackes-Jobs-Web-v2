import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/password';

// Cuentas de administración reales del negocio. Se declaran aquí para que al
// sembrar una base nueva (Neon) nazcan ya con rol `admin`: en la base anterior
// estaban como `company`, y por eso el middleware les negaba el acceso a /crm.
const ADMINS = [
  { email: 'abelardo.carlos@hackesjobs.com.mx', name: 'Abelardo Carlos' },
  { email: 'abelardo.carlosf@gmail.com', name: 'Abelardo Carlos Flores' },
];

/**
 * Sin contraseña en el entorno no se siembra nada.
 *
 * Antes había un `|| 'admin2026'` escrito aquí: bastaba olvidar la variable
 * para que las tres cuentas de administración nacieran con una contraseña
 * legible en el repositorio. Como este seed se corre también contra producción,
 * el olvido no era hipotético.
 */
function exigirContrasenaAdmin(): string {
  const contrasena = process.env.SEED_ADMIN_PASSWORD;

  if (!contrasena) {
    console.error(
      '\n❌ Falta SEED_ADMIN_PASSWORD.\n' +
        '   Las cuentas de administración se crean con ella, así que no hay un\n' +
        '   valor por defecto a propósito. Defínela en .env y vuelve a correr:\n\n' +
        '     SEED_ADMIN_PASSWORD="la-que-elijas"\n'
    );
    process.exit(1);
  }

  if (contrasena.length < 8) {
    console.error('\n❌ SEED_ADMIN_PASSWORD debe tener al menos 8 caracteres.\n');
    process.exit(1);
  }

  return contrasena;
}

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hackesjobs.com.mx';
  const adminPassword = await hashPassword(exigirContrasenaAdmin());
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'admin' },
    create: {
      name: 'Administrador Principal',
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Cuentas del dueño. Se crean con la misma contraseña temporal, que debe
  // cambiarse desde "Mi perfil" en el primer acceso.
  const passTemporal = adminPassword;
  for (const cuenta of ADMINS) {
    const u = await prisma.user.upsert({
      where: { email: cuenta.email },
      update: { role: 'admin' },
      create: { ...cuenta, passwordHash: passTemporal, role: 'admin' },
    });
    console.log('✅ Admin del negocio:', u.email);
  }

  // Las tres cuentas de demostración llevan la contraseña escrita aquí, así que
  // solo se crean cuando se piden explícitamente. Antes se creaban siempre, y
  // este mismo seed se corre contra producción: la de rol `recruiter` abría
  // /crm —CVs y teléfonos de candidatos— con una contraseña que cualquiera con
  // acceso al repositorio podía leer.
  if (process.env.SEED_DEMO === 'true') {
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
    console.log('✅ Recruiter demo creado:', recruiter.email);
  } else {
    console.log('⏭️  Cuentas de demostración omitidas (SEED_DEMO no es "true").');
  }

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
  console.log('\n📋 Cuentas de administración (con SEED_ADMIN_PASSWORD):');
  console.log(`   ${adminEmail}`);
  for (const cuenta of ADMINS) console.log(`   ${cuenta.email}`);

  if (process.env.SEED_DEMO === 'true') {
    console.log('\n📋 Cuentas de demostración (contraseñas públicas, solo desarrollo):');
    console.log('   Empresa:    demo@techcorp.mx / empresa2026');
    console.log('   Candidato:  juan@email.com / candidato2026');
    console.log('   Recruiter:  reclutador@hackesjobs.com.mx / recruiter2026');
  }

  console.log('\n⚠️  Entra a "Mi perfil" y cambia la contraseña de las cuentas admin.');
}

main()
  .catch((error) => {
    // Antes esto era `.catch(console.error)`, que imprime el fallo pero termina
    // con código 0: una migración a medias o una base inalcanzable se veían como
    // un seed correcto, y el problema aparecía después, en runtime.
    console.error('\n❌ El seed falló:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
