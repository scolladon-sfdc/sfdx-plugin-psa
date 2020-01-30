import * as xmlbuilder from 'xmlbuilder';

const end = { pretty: true, indent: '    ', newline: '\n' }

const packageBuilder = (packageContent: String): String => {
    const pkg = {};
    packageContent['Package']['types'].reduce((r, e) => pkg[e.name[0]] = [...new Set((pkg[e.name[0]] || []).concat(e.members))], pkg)
    const xml = xmlbuilder.create('Package')
        .att('xmlns', 'http://soap.sforce.com/2006/04/metadata')
        .dec('1.0', 'UTF-8');

    Object.keys(pkg).filter(x => Array.isArray(pkg[x])).sort().forEach(i => {
        const types = xml.ele('types');
        pkg[i].sort().forEach(y => types.ele('members', y))
        types.ele('name', i);
    });
    xml.ele('version', '' + packageContent['Package'].version[0]);
    return xml.end(end);
}

const customLabelBuilder = (clContent: String): String => {
    const properties = [
        'fullName',
        'categories',
        'language',
        'protected',
        'shortDescription',
        'value',
    ];

    const xml = xmlbuilder.create('CustomLabels')
        .att('xmlns', 'http://soap.sforce.com/2006/04/metadata')
        .dec('1.0', 'UTF-8');
    clContent['CustomLabels']['labels'].forEach(label => {
        const labelNode = xml.ele('labels');
        properties.filter(prop => label.hasOwnProperty(prop)).forEach(prop =>
            labelNode.ele(prop, label[prop][0]));
    });
    return xml.end(end);
}

export { packageBuilder, customLabelBuilder }