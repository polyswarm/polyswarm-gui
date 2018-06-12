const ip = jest.genMockFromModule('ip');
ip.address = jest.fn().mockImplementation(() => '127.0.0.1');
export default ip;
