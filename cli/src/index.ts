import { Entity , DataType, EntityContext, LocalFilesystem, EjsTemplateEngine, ProjectContext, RelationshipParity, FakerTestDataManager } from '@recognizebv/sc3000-generator';
import Generator from '@recognizebv/sc3000-kotlin-spring-backend-generator';

const run = async () => {
    // For now, define a simple entity

    const company: Entity = {
        name: 'Company',
        fields: [
            {
                name: 'name',
                type: DataType.string,
                required: true,
            },
            {
                name: 'street',
                type: DataType.string,
            },
            {
                name: 'streetNumber',
                type: DataType.integer,
            },
            {
                name: 'city',
                type: DataType.string,
            },
            {
                name: 'zipCode',
                type: DataType.string,
            },
        ],
    };

    const project: Entity = {
        name: 'Project',
        fields: [
            {
                name: 'name',
                type: DataType.string,
                required: true,
            },
            {
                name: 'identifier',
                type: DataType.string,
            },
            {
                name: 'description',
                type: DataType.text,
            },
            {
                name: 'company',
                type: {
                    parity: RelationshipParity.manyToOne,
                    target: company,
                },
            },
        ],
    };

    const instance = new Generator();

    const filesystem = new LocalFilesystem(`/Users/b.wesselink/Projects/super-cheetah-3000/sample-project/`);
    const ejs = new EjsTemplateEngine(instance.metaData.templateRoot);
    
    const testData = new FakerTestDataManager();
    const context = {
        project: {
            client: 'recognize',
            name: 'bezoekersapp',
            team: 'team-technology',
        },
        filesystem,
        templateEngine: ejs,
        testData,
    } satisfies ProjectContext;

    await instance.projectCodeProvider?.render(context)
    await instance.entityCodeProvider?.render({ ...context, entity: company });
    await instance.entityCodeProvider?.render({ ...context, entity: project });
};

run();